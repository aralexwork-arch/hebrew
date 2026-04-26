### @flyoutOnly true
### @hideIteration true
### @explicitHints true

# Train the agent

## Step 1
Train the agent on what wood is by ``||haiInputs: classifying||`` an ``||hai: oak log||`` as wood. Click the lightbulb for help or press play when ready to continue.

#### ~ tutorialhint 
Drag the ``||hai: oak log||`` block into the ``||haiInputs: classify as wood||`` block.
```ghost

hai.classifyWood(hai.ghostBlock())
hai.classifyWood(hai.logOak())
hai.classifyWood(hai.grass()) 
hai.craftWith(hai.lava())
hai.craftWith(hai.soulSand())
hai.trainingStart()
```
```template
hai.trainingStart(function () {
})

```
```package
hai2025-he=github:USERNAME/hai2025-he
```
