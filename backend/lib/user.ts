export default interface User {
    username: string
    realmRoles: string[]
    resourceRoles: {
        [key: string]: {
            roles: string[]
        }
    }
}
