
const HOST = 'http://localhost:5000';
const LOCAL = 'http://localhost:3000';

export const handleSubmit = async (lang, query, setResult, setLoading, enqueueSnackbar) => {
    if(query.trim().length > 0){
        setLoading(true);
        const uri = `${HOST}/search?query=${query}&lang=${ lang["selected"] }`;
        await fetch(uri)
        .then(response => response.json())
        .then(data => {
            setResult(data);
        })
        .catch(error => {
            enqueueSnackbar(`${error} - error al conectar con el servidor`, {variant: 'error', autoHideDuration: 3000 })
            setLoading(false)
        })
        .finally(() => setLoading(false));
    }
}