class BasicActions {
    constructor() {
        this.actions = [
            { id: 'acciones_basicas', text: 'Acciones Básicas', videoPath: 'assets/videos/AccionesBasicas/AccionesBasicas.mp4' },
            { id: 'beber', text: 'Beber', videoPath: 'assets/videos/AccionesBasicas/Beber.mp4' },
            { id: 'como', text: 'Cómo', videoPath: 'assets/videos/AccionesBasicas/Como.mp4' },
            { id: 'dormir', text: 'Dormir', videoPath: 'assets/videos/AccionesBasicas/Dormir.mp4' },
            { id: 'estudiar', text: 'Estudiar', videoPath: 'assets/videos/AccionesBasicas/Estudiar.mp4' },
            { id: 'jugar', text: 'Jugar', videoPath: 'assets/videos/AccionesBasicas/Jugar.mp4' },
            { id: 'trabajar', text: 'Trabajar', videoPath: 'assets/videos/AccionesBasicas/Trabajar.mp4' }
        ];
    }

    getActionById(id) {
        return this.actions.find(action => action.id === id);
    }

    getAllActions() {
        return this.actions;
    }

    getTotalActions() {
        return this.actions.length;
    }
} 