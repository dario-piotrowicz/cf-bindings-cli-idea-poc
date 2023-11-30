import { component$ } from "@builder.io/qwik";
import styles from "./hero.module.css";
import ImgThunder from "~/media/thunder.png?jsx";
import { useShowMyKvNumOfEntries } from "~/routes/layout";

export default component$(() => {
  const text = useShowMyKvNumOfEntries();
  return (
    <div class={["container", styles.hero]}>
      <ImgThunder class={styles["hero-image"]} />
      <h3>
        {text.value}
      </h3>
    </div>
  );
});
