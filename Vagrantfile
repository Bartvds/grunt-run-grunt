# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  # Ubuntu 12.04 LTS 'Precise Pangolin'
  config.vm.box = "precise32"
  config.vm.box_url = "http://files.vagrantup.com/precise32.box"

  config.vm.provider :virtualbox do |vb|
    vb.customize [
      "modifyvm", :id,
      "--memory", "1024",
      "--cpus", "1",
    ]
  end

  config.vm.provision :chef_solo do |chef|
    # chef.log_level = :debug
    chef.cookbooks_path = ["tmp/cookbooks", "cookbooks"]
    chef.add_recipe "main"
  end

  config.omnibus.chef_version = '13.3.42'
end
