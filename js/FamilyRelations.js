class FamilyRelations {
    constructor() {
        this.items = [
            { id: 'familia_relaciones', text: 'Familia y Relaciones', videoPath: 'assets/videos/FamiliayRelaciones/FamiliayRelaciones.mp4' },
            { id: 'Amigo', text: 'Amigo', videoPath: 'assets/videos/FamiliayRelaciones/Amigo.mp4' },
            { id: 'hermano', text: 'Hermano(a)', videoPath: 'assets/videos/FamiliayRelaciones/Hermano.mp4' },
            { id: 'abuelo', text: 'Hijo(a)', videoPath: 'assets/videos/FamiliayRelaciones/Hijo.mp4' },
            { id: 'Madre', text: 'Madre', videoPath: 'assets/videos/FamiliayRelaciones/Madre.mp4' },
            { id: 'Padre', text: 'Padre', videoPath: 'assets/videos/FamiliayRelaciones/Padre.mp4' },
        ];
    }

    getAllItems() {
        return this.items;
    }

    getItemById(id) {
        return this.items.find(item => item.id === id);
    }
} 