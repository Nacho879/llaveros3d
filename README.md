# Llaveros3D.com

Landing page estática para crear llaveros personalizados 3D. Los usuarios pueden subir una foto, personalizar su llavero y hacer pedidos.

## Características

- ✅ **Drag & drop** para subir imágenes
- ✅ **Preview** en tiempo real de la imagen procesada
- ✅ **Personalización completa**: estilo (foto/silueta), forma (redondo/rect/píldora), tamaño, color

- ✅ **Formulario de pedido** preparado para Formspree
- ✅ **Integración WhatsApp** con datos prellenados
- ✅ **Diseño responsive** móvil/desktop
- ✅ **Accesibilidad** completa (ARIA, contraste, teclado)
- ✅ **SEO optimizado** con JSON-LD Product Schema
- ✅ **Vanilla JS** sin frameworks

## Configuración

### 1. Número de WhatsApp
Edita el archivo `script.js` y reemplaza:
```javascript
const PHONE = '34XXXXXXXXX'; // Reemplazar con número real
```

### 2. Formspree
1. Ve a [formspree.io](https://formspree.io) y crea una cuenta
2. Crea un nuevo formulario
3. Copia la URL del endpoint
4. Edita `script.js` y reemplaza:
```javascript
const FORMSPREE_URL = 'https://formspree.io/f/XXXXXXX'; // Reemplazar con URL real
```
5. Descomenta el código de Formspree en la función `handleFormSubmit()`

## Despliegue

### Vercel
1. Sube los archivos a un repositorio de GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Conecta tu repositorio
4. Vercel detectará automáticamente que es un sitio estático

### Netlify
1. Sube los archivos a un repositorio de GitHub
2. Ve a [netlify.com](https://netlify.com)
3. Click en "New site from Git"
4. Selecciona tu repositorio
5. Netlify desplegará automáticamente

### Despliegue manual
Simplemente sube todos los archivos a tu servidor web. No se requiere compilación ni build.

## Estructura de archivos

```
llaveros3d/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # JavaScript funcional
├── assets/
│   └── logo.svg        # Logo SVG
└── README.md           # Este archivo
```

## Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Variables CSS, Grid, Flexbox, animaciones
- **Vanilla JavaScript** - ES6+, Canvas API, File API
- **Canvas 2D** - Procesamiento de imágenes y mockups
- **Formspree** - Backend para formularios (opcional)



## Impresión 3D

### Tamaños recomendados
- **40mm**: Para logos simples y texto
- **50mm**: Tamaño estándar, buena relación calidad/precio
- **60mm**: Para fotos detalladas y diseños complejos

### Materiales sugeridos
- **PLA**: Material estándar, buena calidad y durabilidad
- **PETG**: Más resistente al calor y impactos
- **Acrílico**: Para acabados especiales y transparencias

### Configuración de impresión
- **Altura de capa**: 0.2mm para buena calidad
- **Relleno**: 20-30% para equilibrio entre peso y resistencia
- **Soporte**: Solo si es necesario para formas complejas
- **Velocidad**: 50-60mm/s para mejor calidad

## Accesibilidad

El sitio cumple con las directrices WCAG 2.1 AA:
- ✅ Contraste de color adecuado
- ✅ Navegación por teclado
- ✅ Labels asociados con inputs
- ✅ Textos alternativos en imágenes
- ✅ Estructura semántica correcta
- ✅ Soporte para lectores de pantalla

## SEO

- ✅ Meta tags optimizados
- ✅ Open Graph para redes sociales
- ✅ JSON-LD Product Schema
- ✅ URLs amigables
- ✅ Títulos y descripciones optimizados
- ✅ Imágenes con alt text

## Rendimiento

Optimizado para Lighthouse ≥90:
- ✅ CSS y JS minificados
- ✅ Imágenes optimizadas
- ✅ Lazy loading
- ✅ Caché eficiente
- ✅ Sin dependencias externas

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## Soporte

Para soporte técnico o preguntas sobre el proyecto, contacta a través de GitHub Issues.
