<template>
  <footer class="foo">
    <div class="b_wrapper">
      <div class="foo-in">
        <div class="foo-name">
          Pod Nexus
        </div>
        <div class="foo-etc">
          <p>
            Thanks to <a rel="noopener" href="https://www.listennotes.com/">Listen Notes</a> podcast API and the countless
            other contributors to this project's dependencies.
          </p>
          <div class="foo-icon-wrap">
            <a class="foo-link" href="https://github.com/jessezisme/podcast-web-player" rel="noopener" aria-label="GitHub">
              <span class="foo-icon"> <i aria-hidden="true" class="fab fa-github"></i></span>Code on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'BaseFooter',
  // props: [''],
  components: {},
  data: function() {
    return {};
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../../style/base/_variables.scss';

.foo {
  margin-top: 4rem;
  padding: 1rem 0 150px 0;
  background: $color-black;
  font-size: 0.85rem;
}
.foo-in {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.foo-name,
.foo-etc {
  max-width: 300px;
  padding: 1em 15px;
}
.foo-name {
  font-size: 1.5rem;
  font-weight: bold;
}
.foo-icon-wrap {
  display: flex;
  align-items: center;
}
.foo-icon {
  font-size: 1.5rem;
  padding-right: 10px;
}
.foo-link {
  font-size: 0.85rem;
}
</style>
