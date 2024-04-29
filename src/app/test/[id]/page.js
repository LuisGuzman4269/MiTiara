export default function Page({params}) {
  return (
    <div>ID: {params.id ? params.id : 'no id'}</div>
  )
}