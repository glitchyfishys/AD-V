import { RaPetAutobuyerState } from "./ra-pet-autobuyer";

export class TeresaMemoryAutobuyerState extends RaPetAutobuyerState{
    get _petName(){ return 'teresa'; }

    get isUnlocked(){
        return MetaFabricatorUpgrade(9).isBought;
    }

    static get autobuyerGroupName(){ return "Teresa's Memory"; }
    static get isActive() { return player.auto.pets.teresa.isActive; }
    static set isActive(value) { player.auto.pets.teresa.isActive = value; }
}

export class EffarigMemoryAutobuyerState extends RaPetAutobuyerState{
    get _petName(){ return 'effarig'; }

    get isUnlocked(){
        return MetaFabricatorUpgrade(9).isBought;
    }

    static get autobuyerGroupName(){ return "Effarig's Memory"; }
    static get isActive() { return player.auto.pets.effarig.isActive; }
    static set isActive(value) { player.auto.pets.effarig.isActive = value; }
}

export class EnslavedMemoryAutobuyerState extends RaPetAutobuyerState{
    get _petName(){ return 'enslaved'; }

    get isUnlocked(){
        return MetaFabricatorUpgrade(9).isBought;
    }

    static get autobuyerGroupName(){ return "Nameless's Memory"; }
    static get isActive() { return player.auto.pets.enslaved.isActive; }
    static set isActive(value) { player.auto.pets.enslaved.isActive = value; }
}

export class VMemoryAutobuyerState extends RaPetAutobuyerState{
    get _petName(){ return 'v'; }

    get isUnlocked(){
        return MetaFabricatorUpgrade(9).isBought;
    }

    static get autobuyerGroupName(){ return "V's Memory"; }
    static get isActive() { return player.auto.pets.v.isActive; }
    static set isActive(value) { player.auto.pets.v.isActive = value; }
}

export class GlitchMemoryAutobuyerState extends RaPetAutobuyerState{
    get _petName(){ return 'glitchyfishys'; }

    get isUnlocked(){
        return MetaFabricatorUpgrade(9).isBought;
    }

    static get autobuyerGroupName(){ return "Glitch's Memory"; }
    static get isActive() { return player.auto.pets.glitchyfishys.isActive; }
    static set isActive(value) { player.auto.pets.glitchyfishys.isActive = value; }
}

export class CanteMemoryAutobuyerState extends RaPetAutobuyerState{
    get _petName(){ return 'cante'; }

    get isUnlocked(){
        return false;
    }

    static get autobuyerGroupName(){ return "Cante's Memory"; }
    static get isActive() { return player.auto.pets.cante.isActive; }
    static set isActive(value) { player.auto.pets.cante.isActive = value; }
}

export class NullMemoryAutobuyerState extends RaPetAutobuyerState{
    get _petName(){ return 'null'; }

    get isUnlocked(){
        return false;
    }

    static get autobuyerGroupName(){ return "Null's Memory"; }
    static get isActive() { return player.auto.pets.null.isActive; }
    static set isActive(value) { player.auto.pets.null.isActive = value; }
}