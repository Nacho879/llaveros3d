# Google Search Console - Configuración para Llavero3D.com

## 📋 Pasos para conectar Google Search Console

### 1. Acceder a Google Search Console
- Ir a: https://search.google.com/search-console/
- Iniciar sesión con tu cuenta de Google

### 2. Agregar una propiedad
- Hacer clic en "Agregar una propiedad"
- Seleccionar "Prefijo de URL"
- Ingresar: `https://llavero3d.com`

### 3. Verificar la propiedad
**Opción A: Archivo HTML (Recomendado)**
- Seleccionar "Archivo HTML"
- Descargar el archivo de verificación
- Subir el archivo a la raíz del sitio
- Hacer clic en "Verificar"

**Opción B: Meta tag HTML**
- Seleccionar "Etiqueta HTML"
- Copiar el código de verificación
- Agregar al `<head>` del index.html
- Hacer clic en "Verificar"

**Opción C: Google Analytics**
- Si ya tienes Google Analytics configurado
- Seleccionar "Google Analytics"
- Hacer clic en "Verificar"

### 4. Configuración adicional

#### Enviar sitemap
- Ir a "Sitemaps" en el menú lateral
- Agregar: `sitemap.xml`
- Hacer clic en "Enviar"

#### Configurar parámetros de URL
- Ir a "Configuración" > "Parámetros de URL"
- Configurar parámetros que no afecten el contenido

#### Configurar alertas
- Ir a "Configuración" > "Usuarios y permisos"
- Agregar usuarios que necesiten acceso

## 🔧 Configuración técnica

### Meta tag de verificación
```html
<meta name="google-site-verification" content="CODIGO_DE_VERIFICACION_AQUI">
```

### Archivo de verificación
- Nombre: `google[CODIGO].html`
- Ubicación: Raíz del sitio
- Accesible en: `https://llavero3d.com/google[CODIGO].html`

### Sitemap
- URL: `https://llavero3d.com/sitemap.xml`
- Formato: XML
- Incluye todas las páginas del sitio

## 📊 Métricas importantes a monitorear

### Rendimiento
- Impresiones
- Clics
- CTR (Click Through Rate)
- Posición promedio

### Cobertura
- Páginas válidas
- Errores de rastreo
- Páginas excluidas

### Mejoras
- Core Web Vitals
- Usabilidad móvil
- Seguridad

## 🚀 Próximos pasos

1. **Verificar la propiedad** usando uno de los métodos
2. **Enviar el sitemap** para indexación
3. **Configurar alertas** para errores importantes
4. **Monitorear métricas** regularmente
5. **Optimizar** basándose en los datos

## 📞 Soporte

Si necesitas ayuda con la configuración:
- Documentación oficial: https://support.google.com/webmasters
- Comunidad: https://support.google.com/webmasters/community
