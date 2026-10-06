import Vision
import CoreImage
import AppKit
let url = URL(fileURLWithPath: CommandLine.arguments[1])
let out = URL(fileURLWithPath: CommandLine.arguments[2])
let handler = VNImageRequestHandler(url: url)
let req = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([req])
guard let r = req.results?.first else { print("no result"); exit(1) }
let buf = try r.generateScaledMaskForImage(forInstances: r.allInstances, from: handler)
let ci = CIImage(cvPixelBuffer: buf)
let ctx = CIContext()
try ctx.writePNGRepresentation(of: ci, to: out, format: .L8, colorSpace: CGColorSpaceCreateDeviceGray())
print("ok")
