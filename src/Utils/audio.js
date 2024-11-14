import { SettingsModel } from "../Datas/Models/SettingsModel";

const sounds = {
    tenSeconds: new Audio("../Sounds/warning-sound-1.mp3"),
    playerMarked: new Audio("../Sounds/warning-sound-2.mp3")
};

const volumeSettings = () => {
    const sm = SettingsModel.load();
    const isSoundEnabled = sm.__get('sound');
    const volumePercent = sm.__get('volume');
    if(isSoundEnabled)
    {
        return (volumePercent / 100);
    }
    else
    {
        return 0.0;
    }
}


export const playSound = (name, volume = 1.0) => {
    const sound = sounds[name];
    if(sound){
        sound.volume = parseFloat(volumeSettings()) * parseFloat(volume);
        sound.currentTime = 0;
        sound.play();
    }else{
        console.warn(`A(z) ${name} hang nem található!`)
    };
}

export const playLoop = (name, volume = 1.0) => {
    const sound = sounds[name];
    if(sound){
        sound.volume = volume;
        sound.currentTime = 0;
        const interval = setInterval(() => {
            sound.play();
        }, 0);
        return {sound, interval };        
    }else{
        console.warn(`A(z) ${name} hang nem található!`)
    };
}
export const stopLoop = (timer) => {
    console.log("stopLoop", timer);
    clearInterval(timer.interval);
    timer.sound.pause();
    timer.sound.currentTime = 0;
}