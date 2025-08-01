import db from "#db/client";

await db.connect();
await seedEmployees();
await db.end();
console.log("🌱 Database seeded.");

async function seedEmployees() {
  // TODO
  for (let i = 0; i < 10; i++) {
    const name = `Employee ${i + 1}`;
    const birthday = new Date(1990 + i, 0, 1); 
    const salary = 50000 + i * 1000; 
    await db.query(
      "INSERT INTO employees (name, birthday, salary) VALUES ($1, $2, $3)",
      [name, birthday, salary]
    );
  }
  console.log("Employees seeded successfully.");
}
