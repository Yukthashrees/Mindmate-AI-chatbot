# run_test.py
import runpy, os, sys, traceback
print("DEBUG: cwd =", os.getcwd())
try:
    runpy.run_path("app.py", run_name="__main__")
except SystemExit as e:
    print("DEBUG: SystemExit:", e)
except Exception:
    print("DEBUG: traceback below")
    traceback.print_exc()
    sys.exit(1)
