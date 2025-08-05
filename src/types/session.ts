

export interface sessionPayload {
    userId:string,
    email:string,
    role?:string,
    expiresAt:Date
    [key:string]: any
} 