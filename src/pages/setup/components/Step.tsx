export function Step(props: {
  title: string
  class?: string
  children: any
}) {
  return (
    <div class="mx-auto h-full max-w-1024px w-full">
      <div class="centerCol">
        <h1 class="mt-20vh text-28px">
          {props.title}
        </h1>
        {props.children}
      </div>
    </div>
  )
}
