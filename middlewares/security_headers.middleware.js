function securityHeadersMiddleware(req,res,next) {
    try{
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
        res.setHeader('Cross-Origin-Resource-Policy', 'same-origin')
    }catch(error){
        console.error('Error setting security headers:', error)
    }
    next()
}

export default securityHeadersMiddleware
