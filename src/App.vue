<template>
    <div ref="appFrameRef" class="app-frame">
        <AppLoadingScreen :visible="initialGlobalLoading" />
        <router-view
            class="app-route-view text-white font-normal dark:text-[#303133] text-sm w-full overflow-scroll"
            :class="{
                'app-route-view--stacking': stackAnimating,
                'app-route-view--with-footer': isMainTabPage,
                'home-scrollbar': true,
            }"
            id="router-view"
        />
        <Footer
            v-if="isMainTabPage"
            :name="route.path"
            :show-spacer="false"
        />
        <div
            v-show="stackAnimating"
            ref="stackLayerRef"
            class="route-stack-layer"
            :class="[
                `route-stack-layer--${stackDirection}`,
                { 'route-stack-layer--active': stackActive },
            ]"
        >
            <div
                ref="oldStageRef"
                class="route-stack-page route-stack-page--old"
            ></div>
            <div
                ref="newStageRef"
                class="route-stack-page route-stack-page--new"
            ></div>
        </div>
    </div>
</template>

<script setup>
import { useUserStore } from "@/store/modules/user";
import { useCommonStore } from "@/store/modules/common";
import { useI18n } from "vue-i18n";
import BigNumber from "bignumber.js";
import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCurrentLang } from "vant";
import Footer from "@/components/Footer.vue";
import AppLoadingScreen from "@/components/AppLoadingScreen.vue";

BigNumber.config({
    DECIMAL_PLACES: 10,
    ROUNDING_MODE: BigNumber.ROUND_DOWN,
    ERRORS: false,
});

const userStore = useUserStore();
const commonStore = useCommonStore();
const route = useRoute();
const router = useRouter();
const appFrameRef = ref(null);
const stackLayerRef = ref(null);
const oldStageRef = ref(null);
const newStageRef = ref(null);
const stackAnimating = ref(false);
const stackActive = ref(false);
const stackDirection = ref("forward");
const initialGlobalLoading = ref(true);
const mainTabPaths = ["/", "/vips", "/starting", "/records", "/my"];
const routePathStackKey = "route-path-stack";
const explicitBackRouteTargets = {
    "/addCard": ["/cardList"],
    "/addWallet": ["/cardList"],
    "/cardList": ["/my", "/withdraw"],
    "/paymentMethods": ["/my"],
    "/profile": ["/profileItem"],
    "/profileItem": ["/my"],
    "/setting": ["/my"],
    "/updatePassword": ["/profileItem"],
    "/updateTransactionPassword": ["/profileItem"],
    "/withdraw": ["/", "/my"],
};
let pendingTransitionResolve = null;
let restoreRouterPush = null;
let restoreRouterReplace = null;
let restoreHistoryBack = null;
let restoreHistoryForward = null;
let restoreHistoryGo = null;
let removeAfterEach = null;
let routePathStack = [];
let pendingRouteStackAction = null;
let pendingScrollToTopTimer = null;

const { locale } = useI18n();
const currentLang = useCurrentLang();
console.log(currentLang.value);

const isAuthPage = computed(
    () => route.path === "/account/login" || route.path === "/account/register",
);
const isMainTabPage = computed(() => isMainTabRoute(route.path));

function isMainTabRoute(path) {
    return mainTabPaths.includes(path);
}

function syncHomeScrollbarMode(path = route.path) {
    if (typeof document === "undefined") return;
    const shouldUseSingleRouteScrollbar = Boolean(path);
    document.documentElement.classList.toggle(
        "app-home-scroll-lock",
        shouldUseSingleRouteScrollbar,
    );
    if (document.body) {
        document.body.classList.toggle(
            "app-home-scroll-lock",
            shouldUseSingleRouteScrollbar,
        );
    }
}
function finishPendingTransition() {
    if (!pendingTransitionResolve) return;
    const resolve = pendingTransitionResolve;
    pendingTransitionResolve = null;
    nextTick(() => resolve());
}

function shouldAnimateRoute(fromPath, toPath) {
    if (
        ["/account/login", "/account/register"].includes(fromPath) ||
        ["/account/login", "/account/register"].includes(toPath)
    ) {
        return false;
    }
    return !(isMainTabRoute(fromPath) && isMainTabRoute(toPath));
}

function isExplicitBackTarget(fromPath, targetPath) {
    return explicitBackRouteTargets[fromPath]?.includes(targetPath);
}

function saveRoutePathStack() {
    try {
        sessionStorage.setItem(routePathStackKey, JSON.stringify(routePathStack));
    } catch (error) {
        console.warn("Failed to save route stack", error);
    }
}

function loadRoutePathStack(currentPath) {
    try {
        const storedStack = JSON.parse(
            sessionStorage.getItem(routePathStackKey) || "[]",
        );
        if (!Array.isArray(storedStack)) return [currentPath];

        const normalizedStack = storedStack.filter(
            (path) => typeof path === "string" && path,
        );
        const currentIndex = normalizedStack.lastIndexOf(currentPath);

        if (currentIndex >= 0) {
            return normalizedStack.slice(0, currentIndex + 1);
        }

        if (isMainTabRoute(currentPath)) return [currentPath];

        return [...normalizedStack, currentPath];
    } catch (error) {
        console.warn("Failed to load route stack", error);
        return [currentPath];
    }
}

function isStackBackTarget(targetPath) {
    const targetIndex = routePathStack.lastIndexOf(targetPath);
    return targetIndex >= 0 && targetIndex < routePathStack.length - 1;
}

function commitRoutePathStack(targetPath, action, direction) {
    if (!targetPath) return;

    if (direction === "none" && isMainTabRoute(targetPath)) {
        routePathStack = [targetPath];
        saveRoutePathStack();
        return;
    }

    if (direction === "back" || isStackBackTarget(targetPath)) {
        const targetIndex = routePathStack.lastIndexOf(targetPath);
        routePathStack =
            targetIndex >= 0
                ? routePathStack.slice(0, targetIndex + 1)
                : [targetPath];
        saveRoutePathStack();
        return;
    }

    if (action === "replace") {
        if (routePathStack.length) {
            routePathStack[routePathStack.length - 1] = targetPath;
        } else {
            routePathStack = [targetPath];
        }
        saveRoutePathStack();
        return;
    }

    if (routePathStack[routePathStack.length - 1] !== targetPath) {
        routePathStack.push(targetPath);
    }
    saveRoutePathStack();
}

function clearStage(stageRef) {
    if (!stageRef.value) return;
    stageRef.value.innerHTML = "";
}

function syncScrollState(source, clone) {
    if (!(source instanceof HTMLElement) || !(clone instanceof HTMLElement))
        return;
    clone.scrollTop = source.scrollTop;
    clone.scrollLeft = source.scrollLeft;

    const sourceChildren = source.children || [];
    const cloneChildren = clone.children || [];
    for (let i = 0; i < sourceChildren.length; i += 1) {
        syncScrollState(sourceChildren[i], cloneChildren[i]);
    }
}

function freezeFixedState(source, clone, frameRect) {
    if (!(source instanceof HTMLElement) || !(clone instanceof HTMLElement))
        return;

    const computedStyle = window.getComputedStyle(source);
    if (computedStyle.position === "fixed") {
        const isTopBar =
            source.classList.contains("main-tab-top-bar") ||
            source.classList.contains("page-top-bar");
        const isFooter =
            source.classList.contains("pc-fixed-footer") ||
            source.classList.contains("algofy-footer");
        const rect = source.getBoundingClientRect();
        clone.style.position = "absolute";
        clone.style.top = isTopBar ? "0px" : `${rect.top - frameRect.top}px`;
        clone.style.left = isTopBar
            ? "0px"
            : isFooter
              ? "0px"
              : `${rect.left - frameRect.left}px`;
        clone.style.width = `${rect.width}px`;
        clone.style.height = `${rect.height}px`;
        clone.style.right = isFooter ? "0px" : "auto";
        clone.style.bottom = isFooter ? "0px" : "auto";
        clone.style.margin = "0";
        clone.style.transform = "none";
        clone.style.zIndex = computedStyle.zIndex;
    }

    const sourceChildren = source.children || [];
    const cloneChildren = clone.children || [];
    for (let i = 0; i < sourceChildren.length; i += 1) {
        freezeFixedState(sourceChildren[i], cloneChildren[i], frameRect);
    }
}

function captureRouteSnapshot(options = {}) {
    const source = document.getElementById("router-view");
    const frame = appFrameRef.value;
    if (!source || !frame) return null;

    const clone = source.cloneNode(true);
    clone.removeAttribute("id");
    clone.classList.remove("app-route-view--stacking");
    clone.style.width = "100%";
    clone.style.minHeight = `${frame.clientHeight}px`;
    clone.style.pointerEvents = "none";
    clone.style.overflow = "hidden";
    clone.style.opacity = "1";
    clone.style.visibility = "visible";

    const sourceBackground = window.getComputedStyle(source).backgroundColor;
    clone.style.background =
        !sourceBackground || sourceBackground === "rgba(0, 0, 0, 0)"
            ? "#fff"
            : sourceBackground;

    if (Array.isArray(options.hideSelectors)) {
        options.hideSelectors.forEach((selector) => {
            if (!selector) return;
            clone.querySelectorAll(selector).forEach((node) => {
                if (!(node instanceof HTMLElement)) return;
                node.style.visibility = "hidden";
                node.style.opacity = "0";
                node.style.pointerEvents = "none";
            });
        });
    }

    syncScrollState(source, clone);
    freezeFixedState(source, clone, frame.getBoundingClientRect());
    return clone;
}

function waitForTransitionEnd() {
    return new Promise((resolve) => {
        const layer = stackLayerRef.value;
        if (!layer) {
            resolve();
            return;
        }

        const done = () => {
            layer.removeEventListener("transitionend", done);
            resolve();
        };

        layer.addEventListener("transitionend", done, { once: true });
    });
}

async function runStackTransition(direction, navigate, targetPath = "") {
    if (stackAnimating.value || direction === "none") {
        return navigate();
    }

    const shouldHideHomeSummary =
        route.path === "/" && !!targetPath && !isMainTabRoute(targetPath);
    const fromSnapshot = captureRouteSnapshot({
        hideSelectors: shouldHideHomeSummary ? [".welcome-summary"] : [],
    });
    if (!fromSnapshot) {
        return navigate();
    }

    stackDirection.value = direction;
    stackAnimating.value = true;
    stackActive.value = false;
    clearStage(oldStageRef);
    clearStage(newStageRef);
    oldStageRef.value?.appendChild(fromSnapshot);

    try {
        await Promise.resolve(navigate());
        await nextTick();
        if (!shouldKeepRouteScroll(router.currentRoute.value)) {
            window.clearTimeout(pendingScrollToTopTimer);
            scrollRouteContainersToTop("auto");
        }
        await new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
        );

        const toSnapshot = captureRouteSnapshot();
        if (!toSnapshot) {
            return;
        }
        newStageRef.value?.appendChild(toSnapshot);

        requestAnimationFrame(() => {
            stackActive.value = true;
        });

        await waitForTransitionEnd();
    } finally {
        stackAnimating.value = false;
        stackActive.value = false;
        clearStage(oldStageRef);
        clearStage(newStageRef);
    }
}

function buildDirection(targetPath, fallbackDirection) {
    if (!shouldAnimateRoute(route.path, targetPath)) return "none";
    if (isExplicitBackTarget(route.path, targetPath)) return "back";
    if (isStackBackTarget(targetPath)) return "back";
    if (!isMainTabRoute(route.path) && isMainTabRoute(targetPath))
        return "back";
    return fallbackDirection;
}

function shouldKeepRouteScroll(targetRoute) {
    return (
        targetRoute?.meta?.keepScroll === true ||
        targetRoute?.meta?.scrollToTop === false ||
        targetRoute?.query?.keepScroll === "1" ||
        targetRoute?.query?.keepScroll === "true"
    );
}

function shouldSkipZoneActive(targetRoute) {
    return targetRoute?.matched?.some(
        (record) => record.meta?.skipZoneActive === true,
    );
}

function scrollElementToTop(element, behavior = "smooth") {
    if (!element) return;
    if (typeof element.scrollTo === "function") {
        element.scrollTo({ top: 0, left: 0, behavior });
        return;
    }
    element.scrollTop = 0;
    element.scrollLeft = 0;
}

function scrollRouteToTop(targetRoute, behavior = "smooth") {
    if (shouldKeepRouteScroll(targetRoute)) return;

    window.clearTimeout(pendingScrollToTopTimer);
    pendingScrollToTopTimer = window.setTimeout(() => {
        scrollRouteContainersToTop(behavior);
    }, 0);
}

function scrollRouteContainersToTop(behavior = "auto") {
    const routeView = document.getElementById("router-view");
    scrollElementToTop(routeView, behavior);
    scrollElementToTop(
        document.scrollingElement || document.documentElement,
        behavior,
    );
    scrollElementToTop(document.body, behavior);
}

watch(
    () => route.path,
    () => {
        syncHomeScrollbarMode(route.path);
        if (isAuthPage.value) return;

        if (!shouldSkipZoneActive(route)) {
            userStore.getZone();
        }

        if (userStore.token) {
            userStore.getUserInfo({ force: isMainTabRoute(route.path) });
        }
    },
    { immediate: true },
);

if (commonStore.lang) locale.value = commonStore.lang;

onMounted(() => {
    window.setTimeout(() => {
        initialGlobalLoading.value = false;
    }, 650);

    routePathStack = loadRoutePathStack(route.path);
    saveRoutePathStack();

    removeAfterEach = router.afterEach((to) => {
        finishPendingTransition();
        const action = pendingRouteStackAction;
        pendingRouteStackAction = null;
        commitRoutePathStack(
            to.path,
            action?.action || "push",
            action?.direction || "forward",
        );
        if (action?.direction === "forward" || action?.direction === "back") {
            return;
        }
        nextTick(() => scrollRouteToTop(to));
    });

    const originalPush = router.push.bind(router);
    router.push = (to) => {
        const targetPath = router.resolve(to).path;
        const direction = buildDirection(targetPath, "forward");
        pendingRouteStackAction = {
            action: "push",
            direction,
            targetPath,
        };
        return runStackTransition(direction, () => originalPush(to), targetPath);
    };
    restoreRouterPush = () => {
        router.push = originalPush;
    };

    const originalReplace = router.replace.bind(router);
    router.replace = (to) => {
        const targetPath = router.resolve(to).path;
        const direction = buildDirection(targetPath, "forward");
        pendingRouteStackAction = {
            action: "replace",
            direction,
            targetPath,
        };
        return runStackTransition(
            direction,
            () => originalReplace(to),
            targetPath,
        );
    };
    restoreRouterReplace = () => {
        router.replace = originalReplace;
    };

    const originalBack = window.history.back.bind(window.history);
    window.history.back = () => {
        pendingRouteStackAction = {
            action: "pop",
            direction: isMainTabRoute(route.path) ? "none" : "back",
        };
        return runStackTransition(
            isMainTabRoute(route.path) ? "none" : "back",
            () =>
                new Promise((resolve) => {
                    pendingTransitionResolve = resolve;
                    originalBack();
                }),
            routePathStack[routePathStack.length - 2] || "",
        );
    };
    restoreHistoryBack = () => {
        window.history.back = originalBack;
    };

    const originalForward = window.history.forward.bind(window.history);
    window.history.forward = () => {
        pendingRouteStackAction = {
            action: "push",
            direction: "forward",
        };
        return runStackTransition(
            "forward",
            () =>
                new Promise((resolve) => {
                    pendingTransitionResolve = resolve;
                    originalForward();
                }),
            "",
        );
    };
    restoreHistoryForward = () => {
        window.history.forward = originalForward;
    };

    const originalGo = window.history.go.bind(window.history);
    window.history.go = (delta) => {
        if (!delta) return originalGo(delta);
        const direction = delta < 0 ? "back" : "forward";
        pendingRouteStackAction = {
            action: delta < 0 ? "pop" : "push",
            direction,
        };
        return runStackTransition(
            direction,
            () =>
                new Promise((resolve) => {
                    pendingTransitionResolve = resolve;
                    originalGo(delta);
                }),
            "",
        );
    };
    restoreHistoryGo = () => {
        window.history.go = originalGo;
    };
});

onBeforeUnmount(() => {
    syncHomeScrollbarMode("");
    restoreRouterPush?.();
    restoreRouterReplace?.();
    restoreHistoryBack?.();
    restoreHistoryForward?.();
    restoreHistoryGo?.();
    removeAfterEach?.();
    window.clearTimeout(pendingScrollToTopTimer);
});
</script>

<style>
.el-divider {
    margin: 0 !important;
}

:deep(.el-input__wrapper) {
    background-color: #ececec !important;
    box-shadow: none !important;
    font-size: 16px;
}

:deep(.el-input__wrapper:focus-visible) {
    outline: none !important;
}

:deep(.is-focus) {
    box-shadow: none !important;
}

.container {
}

.el-drawer {
    border-top-left-radius: 20px !important;
    border-top-right-radius: 20px !important;
}

.el-drawer__body {
    color: #303133 !important;
}

.el-drawer__header {
    color: #303133 !important;
}

.button-bg {
    background-image: url(@/static/images/block-bg.png);
    background-size: 100% auto;
    background-repeat: no-repeat;
}

.box-shadow {
    box-shadow: 0px 3px 8px 0 rgba(0, 0, 0, 0.16);
}

.hide-scroll::-webkit-scrollbar {
    display: none;
}

.app-frame {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: #fff;
}

.app-route-view {
    min-height: 100vh;
    width: 100%;
}

.app-route-view.home-scrollbar {
    overflow-x: hidden !important;
    overflow-y: auto !important;
}

.app-route-view--with-footer {
    box-sizing: border-box;
    padding-bottom: 86px;
}

.app-route-view--stacking {
    opacity: 0;
    pointer-events: none;
}

.route-stack-layer {
    position: absolute;
    inset: 0;
    z-index: 40;
    overflow: hidden;
    pointer-events: none;
    background: #fff;
}

.route-stack-page {
    position: absolute;
    inset: 0;
    background: #fff;
    overflow: hidden;
    transition: transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform;
}

.route-stack-page--old {
    transform: translate3d(0, 0, 0);
}

.route-stack-page--new {
    transform: translate3d(0, 0, 0);
}

.route-stack-layer--forward .route-stack-page--new {
    transform: translate3d(100%, 0, 0);
}

.route-stack-layer--back .route-stack-page--new {
    transform: translate3d(-100%, 0, 0);
}

.route-stack-layer--active.route-stack-layer--forward .route-stack-page--old {
    transform: translate3d(-28%, 0, 0);
}

.route-stack-layer--active.route-stack-layer--forward .route-stack-page--new {
    transform: translate3d(0, 0, 0);
}

.route-stack-layer--active.route-stack-layer--back .route-stack-page--old {
    transform: translate3d(28%, 0, 0);
}

.route-stack-layer--active.route-stack-layer--back .route-stack-page--new {
    transform: translate3d(0, 0, 0);
}

@media (min-width: 768px) {
    .app-frame {
        max-width: var(--app-pc-max-width, 375px);
        margin: 0 auto;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04);
    }

    html.app-home-scroll-lock,
    body.app-home-scroll-lock {
        height: 100%;
        overflow: hidden !important;
    }

    body.app-home-scroll-lock #app {
        height: 100dvh;
        overflow: hidden !important;
    }

    body.app-home-scroll-lock .app-frame {
        height: 100dvh;
        min-height: 100dvh;
        overflow: hidden !important;
    }

    body.app-home-scroll-lock .app-route-view.home-scrollbar {
        height: 100dvh;
        min-height: 0;
        box-sizing: border-box;
        overflow-x: hidden !important;
        overflow-y: auto !important;
    }
}
</style>
