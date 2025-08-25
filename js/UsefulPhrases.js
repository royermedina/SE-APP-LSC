class UsefulPhrases {
    constructor() {
        this.items = [
            { id: 'frases_utiles', text: 'Frases Útiles', videoPath: 'assets/videos/Frasesutiles/Frasesutiles.mp4' },
            { id: 'Necesito_Ayuda', text: 'Necesito Ayuda', videoPath: 'assets/videos/Frasesutiles/NecesitoAyuda.mp4' },
            { id: 'No_Entiendo', text: 'No Entiendo', videoPath: 'assets/videos/Frasesutiles/NoEntiendo.mp4' },
            { id: 'Puede_Ayudarme', text: 'Puede Ayudarme ', videoPath: 'assets/videos/Frasesutiles/PuedeAyudarme.mp4' },
            { id: 'Puedes_Repetir', text: '¿Puedes Repetir?', videoPath: 'assets/videos/Frasesutiles/PuedesRepetir.mp4' },
        ];
    }

    getAllItems() {
        return this.items;
    }

    getItemById(id) {
        return this.items.find(item => item.id === id);
    }
} 