resource "azure_windows_function_app" "function_app" {

  name                = var.function_name
  location            = var.location
  resource_group_name = var.resource_group

}