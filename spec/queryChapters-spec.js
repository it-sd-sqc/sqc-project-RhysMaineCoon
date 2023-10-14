import { queryChapters } from '../server.js'

describe('queryChapters()', function () {
  // check if chapters return as array // implemented by Bradley Hayes //
  it('should return chapters as array', async function () {
    const chapters = await queryChapters()
    expect(chapters).toBeDefined()
    expect(Array.isArray(chapters)).toBe(true)
  })
  // check if chapters return with expected properties //
  it('should return expected properties from chapters', async function () {
    const chapters = await queryChapters()
    if (chapters.length > 0) {
      const chapter = chapters[0]
      expect(chapter).toHaveProperty('id')
      expect(chapter).toHaveProperty('title')
    }
  })
  // End of implementation /////////////////////////////////
})

describe('example test', function () {
  it('should pass', function () {
    expect(true).toBe(true)
  })
})
