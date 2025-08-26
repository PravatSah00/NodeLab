/*
 * Get a new error object
 */
export function newError (
    {
        message,
        name,
    } : {
        message: string,
        name   : string,
    }
) {
    const error = new Error( message );
    error.name  = name ?? 'INTERNAL_SERVER_ERROR';
}