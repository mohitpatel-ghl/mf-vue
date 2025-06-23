// hostApp/src/utility/eventBus.js
import Vue from 'vue';

// Create a new Vue instance to act as an event bus.
// This instance will be used to emit and listen for events
// across different components and even between the Vue 2 host
// and Vue 3 remote applications.
export const EventBus = new Vue();
