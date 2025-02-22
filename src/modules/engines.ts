import { baseUrl } from '../configs/constants';

class Engines{

    engineFiles: string[] = [];

    engineNames: string[] = [];

    isReady: boolean = false;

    constructor(){
    }

    getEngineFiles(){
        return this.engineFiles;
    }

    getEngineNames(){
        return this.engineNames;
    }

    async fetchEngines(){
        try{
            console.log("Fetching engines from", baseUrl);
            const response = await fetch(baseUrl + '/engines/engines.json');
            const data = await response.json();

            this.engineFiles = data.engines;
            this.engineNames = [];
            this.engineFiles.forEach((engine) => {
                this.engineNames.push(engine.split('.')[0]);
            });
            this.isReady = true;
        }catch(err){
            this.isReady = false;
            console.error("Error fetching engines.json");
            console.error(err);
        }
    }
}

export default Engines;