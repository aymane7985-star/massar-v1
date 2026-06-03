
// Calculates the Levenshtein distance between two strings
export const getLevenshteinDistance = (a: string, b: string): number => {
  const matrix = [];
  const normalizedA = a.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const normalizedB = b.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  for (let i = 0; i <= normalizedB.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= normalizedA.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= normalizedB.length; i++) {
    for (let j = 1; j <= normalizedA.length; j++) {
      if (normalizedB.charAt(i - 1) === normalizedA.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1,   // insertion
            matrix[i - 1][j] + 1    // deletion
          )
        );
      }
    }
  }

  return matrix[normalizedB.length][normalizedA.length];
};

// Finds the best match from a list of students
export const findBestMatch = (
  spokenName: string, 
  students: { id: string; name: string }[]
): { studentId: string; name: string; confidence: number } | null => {
  
  let bestMatch = null;
  let minDistance = Infinity;

  students.forEach(student => {
    // Check against full name
    const distanceFull = getLevenshteinDistance(spokenName, student.name);
    
    // Check against first name only (teacher might say "Amine" instead of "Amine El Alami")
    const firstName = student.name.split(' ')[0];
    const distanceFirst = getLevenshteinDistance(spokenName, firstName);

    // Take the better of the two
    const distance = Math.min(distanceFull, distanceFirst);

    if (distance < minDistance) {
      minDistance = distance;
      bestMatch = student;
    }
  });

  // Tolerance threshold: 
  // Allow slightly more error for longer names, strict for short names.
  // A distance of 3 or less is usually a good fuzzy match for names.
  if (minDistance <= 4) {
    return {
      studentId: bestMatch!.id,
      name: bestMatch!.name,
      confidence: 1 - (minDistance / 10) // Rough confidence score
    };
  }

  return null;
};
