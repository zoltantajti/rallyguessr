const levels = [
    {id:0, name: '----', min: 0, max: 0, fantasyName: 'fn_lvl0'},
    {id:1, name: 'LVL1', min: 0, max: 250, fantasyName: 'fn_lvl1' },
    {id:2, name: 'LVL2', min: 251, max: 500, fantasyName: 'fn_lvl2' },
    {id:3, name: 'LVL3', min: 501, max: 1000, fantasyName: 'fn_lvl3' },    
    {id:4, name: 'LVL4', min: 1001, max: 2000, fantasyName: 'fn_lvl4' },
    {id:5, name: 'LVL5', min: 2001, max: 5000, fantasyName: 'fn_lvl5' },
    {id:6, name: 'LVL6', min: 5001, max: 8000, fantasyName: 'fn_lvl6' },
    {id:7, name: 'LVL7', min: 8001, max: 16000, fantasyName: 'fn_lvl7' },
    {id:8, name: 'LVL8', min: 16001, max: 32000, fantasyName: 'fn_lvl8' },
    {id:9, name: 'LVL9', min: 32001, max: 64000, fantasyName: 'fn_lvl9' },
    {id:10, name: 'LVL10', min: 64001, max: 128000, fantasyName: 'fn_lvl10' }
]

export const getLevelName = (level) => {
    return levels.filter((l) => l?.name === `LVL${level}`)[0]?.name
}
export const getLevelMin = (level) => {
    return levels.filter((l) => l?.name === `LVL${level}`)[0]?.min
}
export const getLevelMax = (level) => {
    return levels.filter((l) => l?.name === `LVL${level}`)[0]?.max
}
export const getFantasyName = (level) => {
    return levels.filter((l) => l?.name === `LVL${level}`)[0]?.fantasyName
}

export const getLevelID = (exp) => {
    for(let level of levels){ if(exp >= level.min && exp <= level.max){ return level.id; }; };
}
export const getLevelMaxInMySkill = (exp) => {
    for(let level of levels){ if(exp >= level.min && exp <= level.max){ return level.max; }; };
}

export const calculateXP = (score) => {
    const maxScore = 15000;
    const maxXP = 100;
    let xp = (score / maxScore) * maxXP;
    if(xp < 0) xp = 0;
    if(xp > maxXP) xp = maxXP;
    return xp;
}

export const calcPercent = (val, max) => {
    let percent = (val / max) * 100;
    return percent.toFixed(0);
}