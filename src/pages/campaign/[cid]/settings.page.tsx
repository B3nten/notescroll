import Dashboard from "./layout"

export default function Settings() {

  return <div>Settings</div>
}

Settings.getLayout = function getLayout(page) {
  return (
    <Dashboard>
      {page}
    </Dashboard>
  )
}