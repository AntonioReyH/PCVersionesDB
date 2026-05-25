# ==========================================
# CONFIGURACIÓN DE BASE DE DATOS
$DB_USER = "postgres"
$DB_PASS = "mCdA4bJAGGk" 
$DB_NAME = "memoria_ip"
$PG_PATH = "C:\Program Files\PostgreSQL\16\bin"
# ==========================================

# Pasar contraseña al entorno y agregar PostgreSQL al PATH temporalmente
$env:PGPASSWORD = $DB_PASS
$env:PATH += ";$PG_PATH"

$SNAPSHOT_DIR = ".\snapshots"
$HISTORY_FILE = "$SNAPSHOT_DIR\history.json"

# Crear carpeta y archivo de historial si no existen
if (-Not (Test-Path $SNAPSHOT_DIR)) { New-Item -ItemType Directory -Path $SNAPSHOT_DIR | Out-Null }
if (-Not (Test-Path $HISTORY_FILE)) { "[]" | Out-File -FilePath $HISTORY_FILE -Encoding utf8 }

function Show-Menu {
    Clear-Host
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "   GESTOR DE DESPLIEGUES Y SNAPSHOTS - PRUEBA DE CONCEPTO " -ForegroundColor Cyan
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "1. Instalar o Actualizar a una versión (Upgrades en cadena)"
    Write-Host "2. Tomar Snapshot (Respaldar estado actual)"
    Write-Host "3. Hacer Rollback (Restaurar un Snapshot antiguo)"
    Write-Host "4. Eliminar archivo de Snapshot (Conservando el registro)"
    Write-Host "5. Ver Historial de Auditoría (Trazabilidad)"
    Write-Host "0. Salir"
    Write-Host "----------------------------------------------------------"
}

while ($true) {
    Show-Menu
    $opcion = Read-Host "Selecciona una opción"

    switch ($opcion) {
        '1' {
            Write-Host "`n--- ACTUALIZACIÓN DE SISTEMA ---" -ForegroundColor Yellow
            $v = Read-Host "Ingrese el número de la versión destino (1, 2, 3, 4 o 5)"
            $tag = "v$v.0"
            
            Write-Host "-> Cambiando código fuente a $tag..." -ForegroundColor Cyan
            git checkout $tag
            
            Write-Host "-> Aplicando migraciones de BD (Encadenamiento automático)..." -ForegroundColor Cyan
            Set-Location backend
            npx prisma generate
            npx prisma migrate deploy
            Set-Location ..
            
            Write-Host "`n[EXITO] Sistema actualizado y operando en la $tag." -ForegroundColor Green
            Pause
        }
        '2' {
            Write-Host "`n--- CREACIÓN DE SNAPSHOT ---" -ForegroundColor Yellow
            $desc = Read-Host "Ingrese el motivo o descripción del snapshot"
            $currentTag = (git describe --tags --abbrev=0 2>$null)
            if (-not $currentTag) { $currentTag = "v_desconocida" }
            
            $dateStr = Get-Date -Format "yyyyMMdd_HHmmss"
            $file = "snap_${currentTag}_${dateStr}.dump"
            
            Write-Host "-> Exportando datos físicos de PostgreSQL..." -ForegroundColor Cyan
            pg_dump -U $DB_USER -F c -d $DB_NAME -f "$SNAPSHOT_DIR\$file"
            
            # Forzamos a PowerShell a tratar el historial como un Array
            [array]$history = @(Get-Content $HISTORY_FILE -Raw | ConvertFrom-Json)
            
            $newEntry = [PSCustomObject]@{
                id = [guid]::NewGuid().ToString()
                version = $currentTag
                fecha = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
                descripcion = $desc
                archivo = $file
                eliminado = $false
            }
            $history += $newEntry
            $history | ConvertTo-Json -Depth 10 | Out-File $HISTORY_FILE -Encoding utf8
            
            Write-Host "`n[EXITO] Snapshot físico creado y registrado en auditoría." -ForegroundColor Green
            Pause
        }
        '3' {
            Write-Host "`n--- ROLLBACK DE SISTEMA ---" -ForegroundColor Yellow
            [array]$history = @(Get-Content $HISTORY_FILE -Raw | ConvertFrom-Json)
            $validSnaps = @($history | Where-Object { $_.eliminado -eq $false })
            
            if ($validSnaps.Count -eq 0) {
                Write-Host "No hay snapshots físicos disponibles para restaurar." -ForegroundColor Red
                Pause; continue
            }
            
            for ($i=0; $i -lt $validSnaps.Count; $i++) {
                Write-Host "[$i] Versión: $($validSnaps[$i].version) | Fecha: $($validSnaps[$i].fecha) | Desc: $($validSnaps[$i].descripcion)"
            }
            
            $sel = Read-Host "`nSeleccione el número del snapshot a restaurar"
            $targetSnap = $validSnaps[$sel]
            
            if ($null -ne $targetSnap) {
                Write-Host "-> 1. Retrocediendo código a $($targetSnap.version)..." -ForegroundColor Cyan
                git checkout $($targetSnap.version)
                
                Set-Location backend
                npx prisma generate
                Set-Location ..
                
                Write-Host "-> 2. Purgando el esquema (Drop Schema Nuclear)..." -ForegroundColor Cyan
                # Borramos todo el interior de la BD sin borrar la BD en sí para evitar bloqueos
                psql -U $DB_USER -d $DB_NAME -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" | Out-Null
                
                Write-Host "-> 3. Restaurando datos físicos del pasado..." -ForegroundColor Cyan
                # Al restaurar sobre un esquema limpio, no quedarán columnas zombi
                pg_restore -U $DB_USER -d $DB_NAME "$SNAPSHOT_DIR\$($targetSnap.archivo)"
                
                Write-Host "`n[EXITO] Rollback completado. El sistema es ahora exactamente como era en $($targetSnap.fecha)." -ForegroundColor Green
            }
            Pause
        }
        '4' {
            Write-Host "`n--- ELIMINAR ARCHIVO (Retención de Historial) ---" -ForegroundColor Yellow
            [array]$history = @(Get-Content $HISTORY_FILE -Raw | ConvertFrom-Json)
            $validSnaps = @($history | Where-Object { $_.eliminado -eq $false })
            
            for ($i=0; $i -lt $validSnaps.Count; $i++) {
                Write-Host "[$i] Eliminar archivo de la Versión: $($validSnaps[$i].version)"
            }
            
            $sel = Read-Host "`nSeleccione el número a eliminar"
            $targetSnap = $validSnaps[$sel]
            
            if ($null -ne $targetSnap) {
                Remove-Item "$SNAPSHOT_DIR\$($targetSnap.archivo)" -Force
                foreach ($item in $history) {
                    if ($item.id -eq $targetSnap.id) { $item.eliminado = $true }
                }
                $history | ConvertTo-Json -Depth 10 | Out-File $HISTORY_FILE -Encoding utf8
                Write-Host "`n[EXITO] Archivo físico eliminado. El registro permanece en el historial de auditoría." -ForegroundColor Green
            }
            Pause
        }
        '5' {
            Write-Host "`n--- HISTORIAL DE AUDITORÍA (HISTORY.JSON) ---" -ForegroundColor Yellow
            [array]$history = @(Get-Content $HISTORY_FILE -Raw | ConvertFrom-Json)
            
            foreach ($item in $history) {
                $estado = if ($item.eliminado) { "[ARCHIVO BORRADO]" } else { "[DISPONIBLE]" }
                Write-Host "- $($item.fecha) | $($item.version) | $($item.descripcion) $estado"
            }
            Pause
        }
        '0' { break }
        default { Write-Host "Opción inválida" -ForegroundColor Red; Pause }
    }
}