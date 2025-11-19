# PSScriptAnalyzer configuration file
# https://github.com/PowerShell/PSScriptAnalyzer

@{
    ExcludeRules = @(
        'PSAvoidUsingPlainTextForPassword',
        'PSUseDeclaredVarsMoreThanAssignments'
    )
    
    IncludeDefaultRules = $true
    
    Severity = @('Error', 'Warning')
}
