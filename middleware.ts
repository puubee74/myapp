import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'


const JWT_SECRET = process.env.JWT_SECRET!


export function middleware(req: NextRequest) {
const { pathname } = req.nextUrl
// зөвхөн (app) хэсгийг хамгаална
if (pathname.startsWith('/product') || pathname.startsWith('/api/products')) {
const token = req.cookies.get('token')?.value
if (!token) return NextResponse.redirect(new URL('/login', req.url))
try { jwt.verify(token, JWT_SECRET) } catch {
return NextResponse.redirect(new URL('/login', req.url))
}
}
return NextResponse.next()
}


export const config = {
matcher: [
'/product/:path*',
'/api/products/:path*',
],
}