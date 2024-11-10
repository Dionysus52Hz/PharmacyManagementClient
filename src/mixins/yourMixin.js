// src/mixins/yourMixin.js
export const yourMixin = {
    data() {
        return {
            mixinData: 'This is data from the mixin',
        };
    },
    methods: {
        mixinMethod() {
            console.log('This is a method from the mixin');
        },
    },
};
