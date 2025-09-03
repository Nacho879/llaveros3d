# 🚀 Configuración Automática de Vercel Postgres

## **¿Qué hace este script?**

Configura **automáticamente** todas las variables de entorno de Postgres en tu proyecto de Vercel, para que las APIs funcionen correctamente.

## **📋 Requisitos Previos:**

1. **Vercel CLI instalado**: `npm i -g vercel`
2. **Logueado en Vercel**: `vercel login`
3. **En el directorio del proyecto**: `cd llaveros3d`

## **🤖 Ejecutar Script Automático:**

### **Opción 1: Script Bash (Mac/Linux)**
```bash
./setup-vercel.sh
```

### **Opción 2: Script Node.js**
```bash
node vercel-setup.js
```

## **🔧 Configuración Manual (Si el script falla):**

### **PASO 1: Ir al Dashboard de Vercel**
1. Abre: https://vercel.com/dashboard
2. **Inicia sesión** con tu cuenta
3. **Selecciona** tu proyecto `llaveros3d`

### **PASO 2: Ir a Environment Variables**
1. Ve a la pestaña **"Settings"**
2. Busca **"Environment Variables"**
3. Haz click en **"Add New"**

### **PASO 3: Añadir las 5 Variables**

**Variable 1:**
- **Name:** `POSTGRES_URL`
- **Value:** `postgresql://neondb_owner:npg_JDn2G6orUidf@ep-icy-cell-abuuk5ny-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development
- **Encrypt:** ✅ (marcado)

**Variable 2:**
- **Name:** `POSTGRES_HOST`
- **Value:** `ep-icy-cell-abuuk5ny-pooler.eu-west-2.aws.neon.tech`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development
- **Encrypt:** ✅ (marcado)

**Variable 3:**
- **Name:** `POSTGRES_USER`
- **Value:** `neondb_owner`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development
- **Encrypt:** ✅ (marcado)

**Variable 4:**
- **Name:** `POSTGRES_PASSWORD`
- **Value:** `npg_JDn2G6orUidf`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development
- **Encrypt:** ✅ (marcado)

**Variable 5:**
- **Name:** `POSTGRES_DATABASE`
- **Value:** `neondb`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development
- **Encrypt:** ✅ (marcado)

### **PASO 4: Guardar y Redeploy**
1. Haz click en **"Save"** para cada variable
2. Ve a **"Deployments"**
3. Busca tu último deployment
4. Haz click en **"Redeploy"** (3 puntos → Redeploy)

## **✅ Verificación:**

Después de configurar las variables:

1. **Ejecuta**: `vercel --prod`
2. **Ve a**: Tu página de test
3. **Prueba**: "Estado de la Base de Datos"
4. **Resultado esperado**: ✅ Conexión exitosa a Postgres

## **🔍 Troubleshooting:**

### **Si las variables no se guardan:**
- Verifica que estés en el proyecto correcto
- Asegúrate de que las variables no existan ya
- Intenta hacer logout y login en Vercel

### **Si sigue fallando:**
- Verifica que las credenciales de Neon sean correctas
- Comprueba que la base de datos esté activa
- Revisa los logs de Vercel para errores específicos

## **📞 Soporte:**

Si nada funciona, puedes:
1. **Verificar** que Neon esté funcionando
2. **Revisar** los logs de Vercel
3. **Contactar** soporte de Vercel

---

**¡Con estas variables configuradas, tu proyecto funcionará perfectamente!** 🎉
