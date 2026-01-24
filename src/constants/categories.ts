export interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

export const CATEGORIES: Category[] = [
  // Parent Categories
  { id: "1", name: "Abstract", parentId: null },
  { id: "2", name: "Nature", parentId: null },
  { id: "3", name: "Technology", parentId: null },
  { id: "4", name: "Anime", parentId: null },
  { id: "5", name: "Minimalist", parentId: null },

  // Children of Abstract (1)
  { id: "11", name: "Geometric", parentId: "1" },
  { id: "12", name: "Fluid", parentId: "1" },
  { id: "13", name: "3D Renders", parentId: "1" },

  // Children of Nature (2)
  { id: "21", name: "Landscapes", parentId: "2" },
  { id: "22", name: "Oceans", parentId: "2" },
  { id: "23", name: "Forests", parentId: "2" },
  { id: "24", name: "Mountains", parentId: "2" },

  // Children of Technology (3)
  { id: "31", name: "Cyberpunk", parentId: "3" },
  { id: "32", name: "AI Art", parentId: "3" },
  { id: "33", name: "Coding", parentId: "3" },

  // Children of Anime (4)
  { id: "41", name: "Characters", parentId: "4" },
  { id: "42", name: "Scenery", parentId: "4" },
];
