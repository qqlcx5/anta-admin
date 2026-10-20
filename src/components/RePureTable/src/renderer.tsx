import { defineComponent, type PropType } from "vue";

const props = {
  render: {
    type: Function as PropType<(params: any) => any>,
    required: true
  },
  params: {
    type: Object,
    default: () => ({})
  }
};

export default defineComponent({
  name: "Renderer",
  props,
  setup(props) {
    return () =>
      typeof props.render === "function" ? (
        <>{props.render(props.params)}</>
      ) : null;
  }
});
