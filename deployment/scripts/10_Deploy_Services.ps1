param(
    [string]$EnvironmentName
    )

$ScriptDir = Split-Path $script:MyInvocation.MyCommand.Path

Write-Host $ScriptDir

if ($EnvironmentName)
{
    Write-Host "Selected Environment "$EnvironmentName
    $initPath=Join-Path $ScriptDir ".." "init_env.ps1"
    .  $initPath -Name $EnvironmentName -NoLogin
}

# Start-Transcript 

# Set the extension to use dynamic installation
az config set extension.use_dynamic_install=yes_without_prompt

# Add the extension for Azure Web App AuthV2
az extension add --name authV2

# Add Application Insights Extension
az extension add --name application-insights

# Deploy steps
Write-Host "=============================================================="
Set-Subscription

Write-Host "=============================================================="
# Assert-Subscription

Write-Host "=============================================================="
New-ResourceGroups

Write-Host "=============================================================="
New-StorageAccount

Write-Host "=============================================================="
New-AppInsights

Write-Host "=============================================================="
New-AzureKeyVault

Write-Host "=============================================================="
New-CognitiveServices

Write-Host "=============================================================="
Deploy-OpenAIModule

Write-Host "=============================================================="
New-SearchServices

Write-Host "=============================================================="
New-AzureMapsService

Write-Host "=============================================================="
New-BingSearchService

Write-Host "=============================================================="
New-WebApps

Write-Host "=============================================================="
New-Functions

Add-DataStorageRBAC
Add-SearchRBAC
Add-KeyVaultWebAppsRBAC 
Add-KeyVaultFunctionsRBAC     

# Save and Apply the Parameters we got
Sync-Config

# Add all keys and connection strings to the KV 
Initialize-KeyVault

# Stop-Transcript
