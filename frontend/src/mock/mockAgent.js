export function mockGenerate(prompt, version = 1) {
  return {
    code: `<>
  <Card className="p-10 flex items-center justify-center">
    <h1 className="text-6xl font-bold">${version}</h1>
  </Card>
</>`,
    explanation: `Generated version ${version}`
  };
}
