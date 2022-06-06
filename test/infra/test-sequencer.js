const Sequencer = require('@jest/test-sequencer').default;

/** Makes sure test are run in order of their respective .spec files */
class CustomSequencer extends Sequencer {
  sort(tests) {
    const copyTests = Array.from(tests);
    return copyTests.sort((testA, testB) => {
      if (testA.path.includes('infra')) {
        return -1;
      }
      if (testB.path.includes('infra')) {
        return 1;
      }
      return testA.path > testB.path ? 1 : -1;
    });
  }
}

module.exports = CustomSequencer;
