import { Scene, View } from '@novorender/webgl-api'

interface ISearchComponent {
  view: View
}
export const Search = (props: ISearchComponent) => {
  const { view } = props

  function isolateObjects(scene: Scene, ids: number[]): void {
    scene.objectHighlighter.objectHighlightIndices.fill(255)
    ids.forEach((id) => (scene.objectHighlighter.objectHighlightIndices[id] = 0))
    scene.objectHighlighter.commit()
  }

  function displayAll(): void {
    view.scene?.objectHighlighter.objectHighlightIndices.fill(0)
    view.scene?.objectHighlighter.commit()
  }

  const search = async (searchParam: string) => {
    if (view.scene) {
      const iterator = view.scene.search({
        searchPattern: searchParam,
      })
      const result: number[] = []
      for await (const object of iterator) {
        result.push(object.id)
      }
      if (result.length > 0) {
        isolateObjects(view.scene, result)
      } else {
        displayAll()
      }
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const searchParam = e.target?.elements?.searchParam?.value
    if (searchParam) {
      search(searchParam)
    } else {
      displayAll()
    }
  }

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <input
            type="text"
            id="search"
            name="searchParam"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Chair"
          />
          <button
            type="submit"
            className="text-white bg-black hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}
