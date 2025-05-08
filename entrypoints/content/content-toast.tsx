import { ContentScriptContext } from "#imports";
import { notification } from "antd";
import ReactDOM from "react-dom/client";

function ContentToast(props: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  useEffect(() => {
    notification.open({
      message: props.title,
      description: props.description,
      onClick: props.onClick,
    });
  });

  return null;
}

function showToast(
  ctx: ContentScriptContext,
  title: string,
  description: string,
  onclick?: () => void,
) {
  const ui = createIntegratedUi(ctx, {
    position: "inline",
    anchor: "body",
    onMount: (container) => {
      const root = ReactDOM.createRoot(container);
      root.render(
        <ContentToast
          title={title}
          description={description}
          onClick={onclick}
        />,
      );
      return root;
    },
    onRemove: (root) => {
      root?.unmount();
    },
  });

  ui.mount();
}

export default showToast;
