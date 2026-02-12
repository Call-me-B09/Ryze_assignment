export function mockGenerate(prompt) {
  const p = prompt.toLowerCase();

  if (p.includes("dashboard")) {
    return {
      code: `<>
  <Navbar />
  <div className="flex h-screen">
    <Sidebar />
    <div className="flex-1 p-8 bg-gray-100 dark:bg-black">
      <Card className="mb-6">
        <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>
        <Table columns={["Name", "Email", "Role", "Status"]} data={[
          { name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
          { name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
          { name: "Bob Johnson", email: "bob@example.com", role: "Editor", status: "Offline" }
        ]} />
      </Card>
      <div className="grid grid-cols-3 gap-6">
         <Card>
            <h3 className="font-bold mb-2">Total Users</h3>
            <p className="text-3xl text-blue-600">1,234</p>
         </Card>
         <Card>
            <h3 className="font-bold mb-2">Revenue</h3>
            <p className="text-3xl text-green-600">$45,678</p>
         </Card>
         <Card>
            <h3 className="font-bold mb-2">Active</h3>
            <p className="text-3xl text-purple-600">89%</p>
         </Card>
      </div>
    </div>
  </div>
</>`,
      explanation: "I've created a comprehensive dashboard layout for you. It includes a Navbar at the top, a Sidebar for navigation, and a main content area with a data Table and some summary Cards."
    };
  }

  if (p.includes("login") || p.includes("form")) {
    return {
      code: `<>
  <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
    <Card className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input placeholder="Enter your email" type="email" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <Input placeholder="Enter your password" type="password" />
        </div>
        <Button className="w-full" variant="primary">Sign In</Button>
      </div>
    </Card>
  </div>
</>`,
      explanation: "Here is a clean login form layout. I used a centered Card container with Input fields for email and password, and a primary Button for submission."
    };
  }

  if (p.includes("landing")) {
    return {
      code: `<>
  <Navbar />
  <div className="min-h-screen bg-white dark:bg-black">
    <div className="py-20 text-center px-4">
      <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Build Future UI</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">Generate stunning user interfaces with the power of AI. Just describe what you want, and watch it come to life.</p>
      <div className="flex gap-4 justify-center">
        <Button variant="primary">Get Started</Button>
        <Button variant="secondary">Learn More</Button>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-8 px-12 pb-20">
      <Card className="text-center p-8">
        <h3 className="text-xl font-bold mb-2">Fast</h3>
        <p>Generate code in seconds.</p>
      </Card>
      <Card className="text-center p-8">
        <h3 className="text-xl font-bold mb-2">Clean</h3>
        <p>Production-ready code.</p>
      </Card>
      <Card className="text-center p-8">
        <h3 className="text-xl font-bold mb-2">Modern</h3>
        <p>Built with Tailwind & React.</p>
      </Card>
    </div>
  </div>
</>`,
      explanation: "I've generated a modern landing page structure. It features a hero section with a gradient headline and call-to-action Buttons, followed by a features grid using Cards."
    };
  }

  // Default response
  return {
    code: `<>
  <Card>
    <h3 className="text-lg font-bold mb-4">Hello World</h3>
    <p className="mb-4">This is a generated component.</p>
    <div className="flex gap-2">
      <Input placeholder="Type something..." />
      <Button>Send</Button>
    </div>
  </Card>
</>`,
    explanation: "I created a simple generic layout with a Card, some text, an Input, and a Button since I wasn't sure exactly what you wanted."
  };
}
