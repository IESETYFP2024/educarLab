# EducarLab - Instrucciones de Uso

git clone https://github.com/IESETYFP2024/educarLab

para tener la base de datos que estamos utilizando importa el script bdeducar.sql que se encuentra en el repositorio

cd backend --> npm install

cd frontend --> npm install

para iniciar el backend: /backend --> npm start

para iniciar el frontend : /frontend --> npm run dev

para contribuir tu parte:

	git add *
	git commit -m 'tu comentario'
	git push origin main

tene mucho cuidado y consulta a los compañeros si modificas código ya existente, ya que todos van a tener que actualizar tu cambio/adición

Si no te deja hacer el push origin es probablemente porque debes actualizar el codigo ya que se actualizo en el repositorio, por favor no utilices ningun codigo que fuerce el push como 'push -f origin main' ya que eso borraria los cambios en el repositorio

utilizar el siguiente codigo para actualizar
para actualizar con el código fuente del repositorio:

	git pull origin main

si no te da error el backend modifica el archivo "conexión.js" que esta dentro de "db" con tus configuraciones de base de datos
