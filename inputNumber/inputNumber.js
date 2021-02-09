Vue.component("inputNumber", {
    props : ["value", "min"],
    template : `<div class="inputNumber">
        <div class="inputNumberSigne" @click="minus">-</div>
        <div class="inputValeur">{{number}}</div>
        <div class="inputNumberSigne" @click="plus">+</div>
    </div>`,
    data() {
        return {
            number : this.value
        }
    },
    methods: {
        minus(){
            if (this.min && this.number <= this.min) return
            this.number--;
            this.$emit("input", this.number);
        },
        plus(){
            this.number++;
            this.$emit("input", this.number);
        }
    }
})