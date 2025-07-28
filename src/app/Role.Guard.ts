import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles = route.data['roles'] as number[];
    const usuarioString = sessionStorage.getItem('usuario');
   const usuario = usuarioString ? JSON.parse(usuarioString) : null;
console.log(usuario)
    if (!usuario || !allowedRoles.includes(usuario.rol_id)) {
      this.router.navigate(['/login']); // o a una página /acceso-denegado
      return false;
    }

    return true;
  }
}
