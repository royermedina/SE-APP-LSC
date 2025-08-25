class CommonQuestions {
    constructor() {
        this.items = [
            { id: 'preguntas', text: 'Preguntas', videoPath: 'assets/videos/PreguntasComunes/PreguntasComunes.mp4' },
            { id: 'Cuando', text: 'Cuando', videoPath: 'assets/videos/PreguntasComunes/Cuando.mp4' },
            { id: 'Donde', text: 'Donde', videoPath: 'assets/videos/PreguntasComunes/Donde.mp4' },
            { id: 'Porque', text: '¿Por que?', videoPath: 'assets/videos/PreguntasComunes/Porque.mp4' },
            { id: 'Que', text: '¿Que?', videoPath: 'assets/videos/PreguntasComunes/Que.mp4' },
            { id: 'Quien', text: '¿Quien?', videoPath: 'assets/videos/PreguntasComunes/Quien.mp4' },
        ];
    }

    getAllItems() {
        return this.items;
    }

    getItemById(id) {
        return this.items.find(item => item.id === id);
    }
} 