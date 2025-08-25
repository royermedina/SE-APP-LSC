class EmotionsSensations {
    constructor() {
        this.items = [
            { id: 'emociones_sensaciones', text: 'Emociones y Sensaciones', videoPath: 'assets/videos/EmocionySensaciones/EmocionySensaciones.mp4' },
            { id: 'Cansado', text: 'Cansado', videoPath: 'assets/videos/EmocionySensaciones/Cansado.mp4' },
            { id: 'Enojado', text: 'Enojado', videoPath: 'assets/videos/EmocionySensaciones/Enojado.mp4' },
            { id: 'Feliz', text: 'Feliz', videoPath: 'assets/videos/EmocionySensaciones/Feliz.mp4' },
            { id: 'Nervioso', text: 'Nervioso', videoPath: 'assets/videos/EmocionySensaciones/Nervioso.mp4' },
            { id: 'Sorprendido', text: 'Sorprendido', videoPath: 'assets/videos/EmocionySensaciones/Sorprendido.mp4' },
            { id: 'Triste', text: 'Triste', videoPath: 'assets/videos/EmocionySensaciones/Triste.mp4' },
        ];
    }

    getAllItems() {
        return this.items;
    }

    getItemById(id) {
        return this.items.find(item => item.id === id);
    }
} 