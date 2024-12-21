export interface Tab {
  id: number
  name: string | undefined
  type: string
  code: string
  path: string | undefined
  result: string | undefined
  info: {
    name: string
    php_version: string
    version: string
  }
}
