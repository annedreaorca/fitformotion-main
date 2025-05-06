// C:\Users\anned\Desktop\fitformotion\app\(protected)\profile\_components\ProfileStats.tsx

interface UserMeasurements {
  weight?: number | null;
  height?: number | null;
  birthdate?: Date | null;
}

// Helper function to calculate age from birthdate
function calculateAge(birthdate: Date | null): number | null {
  if (!birthdate) return null;
  
  const birthDate = new Date(birthdate);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export default function ProfileStats({
  userMeasurements,
}: {
  userMeasurements: UserMeasurements;
}) {
  const age = calculateAge(userMeasurements.birthdate || null);
  
  return (
    <div className="grid grid-flow-col lg:px-40 mb-3">
      {userMeasurements.weight && (
        <div className="text-center">
          <div className="mb-1 space-x-1">
            <span className="text-5xl">{userMeasurements.weight}</span>
            <span className="text-zinc-500">kg</span>
          </div>
          <div className="text-sm text-zinc-500">Weight</div>
        </div>
      )}

      {userMeasurements.height && (
        <div className="text-center">
          <div className="mb-1 space-x-1">
            <span className="text-5xl">{userMeasurements.height}</span>
            <span className="text-zinc-500">cm</span>
          </div>
          <div className="text-sm text-zinc-500">Height</div>
        </div>
      )}

      {age && (
        <div className="text-center">
          <div className="mb-1 space-x-1">
            <span className="text-5xl">{age}</span>
            <span className="text-zinc-500">y.o</span>
          </div>
          <div className="text-sm text-zinc-500">Age</div>
        </div>
      )}
    </div>
  );
}