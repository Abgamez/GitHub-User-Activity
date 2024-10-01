
async function getGithubActivity(username) {
    try {
        //consulta a la api de GitHub
        const response = await fetch(
            `https://api.github.com/users/${username}/events`,
            {
                headers: {
                    "User-Agent": "node.js",
                },
            },
        )
        //comprobar que la resuesta sea Exitosa (Status === 200)
        if (!response.ok) {
            if (response.status === 404) {
                console.error("Usuario no encontrado, por favor verificar el nombre del usuario de GitHub.");
                process.exit(1);
            }
        }
        return response.json()
    } catch (error) {
        console.error("Error al realizar la consulta, por favor intentelo más tarde");
        process.exit(1);
    }
}

function mostrarActivity(respuesta) {
    
    if (respuesta.length === 0) {
        console.log("No posee ninguna actividad")
        process.exit(1);
    }
    //recorremos la respuesta e imprimimos la actividad del usuario
    respuesta.forEach((element) => {
        let action
        switch (element.type) {
            case "PushEvent":
                const commitCount = element.payload.commits.length;
                action = `Pushed ${commitCount} commit(s) to ${element.repo.name}`;
                break;
            case "IssuesEvent":
                action = `${element.payload.action.charAt(0).toUpperCase() + element.payload.action.slice(1)} an issue in ${element.repo.name}`;
                break;
            case "WatchEvent":
                action = `Starred ${element.repo.name}`;
                break;
            case "ForkEvent":
                action = `Forked ${element.repo.name}`;
                break;
            case "CreateEvent":
                action = `Created ${element.payload.ref_type} in ${element.repo.name}`;
                break;
            default:
                action = `${element.type.replace("Event", "")} in ${element.repo.name}`;
                break;
        }
        console.log(`- ${action}`);
    });
}



// codigo para recibir por consola 
const username = process.argv[2];
// verificamos que exista un username por consola
if (!username) {
    console.error("Por favor introduzca un nombre de Usuario de GitHub.");
    process.exit(1);
}

//llamamos la funcion para obtener la actividad del usuario
getGithubActivity(username)
    .then((respuesta) => {
        //imprimir la actividad del usuario
        mostrarActivity(respuesta)
    })
    .catch((err) => {
        console.error(err.message);
        process.exit(1);
    });
