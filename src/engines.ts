class Engines{

    engineFiles: string[] = [];

    engineNames: string[] = [];

    isReady: boolean = false;

    constructor(){
        fetch('/engines/engines.json').then(response => {
            return response.json();
        }).then(data => {
            this.engineFiles = data.engines;
            this.engineFiles.forEach((engine) => {
                this.engineNames.push(engine.split('.')[0]);
            });
            this.isReady = true;
            console.log("Engines fetched", this.engineFiles);
        }).catch(err => {
            this.isReady = false;
            console.error("Error fetching engines.json");
            console.error(err);
        });
    }
    
    getEngineFiles(){
        return this.engineFiles;
    }

    getEngineNames(){
        return this.engineNames;
    }
}

export default Engines;