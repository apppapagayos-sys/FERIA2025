/* Reset básico */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    background: #e3f2fd;
    color: #0d47a1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

header {
    background-color: #1565c0;
    color: white;
    padding: 1.5rem;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

main {
    flex-grow: 1;
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;
}

h1, h2 {
    margin-bottom: 1rem;
}

form {
    background-color: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(21,101,192,0.3);
    margin-bottom: 2rem;
}

label {
    display: block;
    margin-bottom: 0.3rem;
    font-weight: 600;
}

input[type="text"],
input[type="email"],
input[type="date"],
select {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #90caf9;
    border-radius: 4px;
    font-size: 1rem;
}

button {
    background-color: #1565c0;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1.1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #0d47a1;
}

#mensajeTurno, #respuesta {
    margin-top: 1rem;
    font-weight: 600;
    min-height: 1.5rem;
}

footer {
    background-color: #1565c0;
    color: white;
    text-align: center;
    padding: 1rem;
    font-size: 0.9rem;
}
