<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    display: boolean;
    loading?: boolean;
    actionHidden?: boolean;
    actionDisabled?: boolean;
    primaryAction?: string;
    secondaryAction?: string;
    maxWidth?: string;
    persistent?: boolean;
    divide?: boolean;
    autoHeight?: boolean;
    promptOnClose?: boolean;
  }>(),
  {
    subtitle: '',
    loading: false,
    actionHidden: false,
    actionDisabled: false,
    primaryAction: undefined,
    secondaryAction: undefined,
    maxWidth: '900px',
    persistent: false,
    divide: false,
    autoHeight: false,
    promptOnClose: false,
  },
);
const emit = defineEmits<{
  (event: 'confirm'): void;
  (event: 'cancel'): void;
}>();

const { t } = useI18n();

const { subtitle, primaryAction, secondaryAction, display, promptOnClose } = toRefs(props);
const wrapper = ref<HTMLElement>();

const primary = computed(() => get(primaryAction) || t('common.actions.confirm'));
const secondary = computed(() => get(secondaryAction) || t('common.actions.cancel'));

const confirm = () => emit('confirm');
const cancel = () => emit('cancel');

const displayModel = computed({
  get() {
    return get(display);
  },
  set(value) {
    if (!value)
      cancel();
  },
});

const { show } = useConfirmStore();

function promptClose() {
  if (!get(promptOnClose))
    return;

  show(
    {
      title: 'You have unsave changes',
      message: 'Are you sure you want to discard the changes?',
      type: 'info',
      primaryAction: 'Discard',
    },
    async () => {
      set(displayModel, false);
    },
  );
}
</script>

<template>
  <RuiBottomSheet
    v-model="displayModel"
    v-bind="$attrs"
    :persistent="persistent || promptOnClose"
    class="big-dialog"
    width="98%"
    :max-width="maxWidth"
    @click:esc="promptClose()"
    @click:outside="promptClose()"
  >
    <RuiCard
      :divide="divide"
      data-cy="bottom-dialog"
      class="!rounded-b-none"
    >
      <template #header>
        <slot name="header">
          {{ title }}
        </slot>
      </template>
      <template
        v-if="subtitle || $slots.subtitle"
        #subheader
      >
        <slot name="subtitle">
          {{ subtitle }}
        </slot>
      </template>
      <div
        v-if="display"
        ref="wrapper"
        class="overflow-y-auto -mx-4 px-4 -mt-4 pt-2 pb-4"
        :class="[$style.card, { [$style['auto-height']]: autoHeight }]"
      >
        <slot :wrapper="wrapper" />
      </div>

      <RuiDivider class="mb-4 -mx-4" />

      <slot name="footer">
        <div class="flex flex-row gap-2 w-full">
          <slot name="left-buttons" />
          <div class="grow" />
          <RuiButton
            color="primary"
            variant="outlined"
            data-cy="cancel"
            @click="cancel()"
          >
            {{ secondary }}
          </RuiButton>
          <RuiButton
            v-if="!actionHidden"
            data-cy="confirm"
            color="primary"
            :disabled="actionDisabled || loading"
            :loading="loading"
            @click="confirm()"
          >
            {{ primary }}
          </RuiButton>
        </div>
      </slot>
    </RuiCard>
  </RuiBottomSheet>
</template>

<style module lang="scss">
.card {
  max-height: calc(90vh - 190px);

  &:not(.auto-height) {
    min-height: 50vh;
  }
}
</style>
